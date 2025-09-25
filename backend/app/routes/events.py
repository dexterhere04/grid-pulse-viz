# app/routes/events.py
from flask import Blueprint, request, jsonify, current_app
from app.models import Device,SensorEventSchema, db
from datetime import datetime, timezone
from pydantic import ValidationError

events_bp = Blueprint("events", __name__)

@events_bp.route("/", methods=["POST"])
def receive_event():
    """
    Receive sensor event payloads from devices.
    Headers:
        X-Device-ID : ID of the device
    Body:
        JSON payload containing sensor data
        {
            "obiscode": "...",
            "metric": "...",
            "value": ...
        }
    """
    try:
        # 1️⃣ Get JSON payload
        payload = request.get_json()
        if not payload:
            return jsonify({"error": "Invalid JSON payload"}), 400

        # 2️⃣ Get device ID from header
        device_id = request.headers.get("X-Device-ID")
        if not device_id:
            return jsonify({"error": "Missing X-Device-ID header"}), 400

        # 3️⃣ Validate device in Postgres
        device = Device.query.filter_by(device_id=device_id).first()
        if not device:
            return jsonify({"error": "Unknown device"}), 400

        # 4️⃣ Add sensor & timestamp
        payload["sensor"] = device.name
        payload["timestamp"] = datetime.now(timezone.utc)

        # 5️⃣ Validate payload using Pydantic
        try:
            event = SensorEventSchema(**payload)
        except ValidationError as e:
            return jsonify({"error": "Invalid payload structure", "details": e.errors()}), 400

        # 7️⃣ Index into Elasticsearch
        es = current_app.elasticsearch
        index_name = f"{event.metric}-events"  # Example: "lux-events", "temperature-events"
        es.index(index=index_name, document=event.dict())

        return jsonify({"status": "success"}), 201

    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

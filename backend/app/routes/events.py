# app/routes/events.py

from flask import Blueprint, request, jsonify, current_app
from app.models import Device
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import base64, json
from datetime import datetime, timezone

events_bp = Blueprint("events", __name__)

@events_bp.route("/", methods=["POST"])
def receive_event():
    """
    Receive encrypted event payloads from agents.
    Headers:
        X-Device-ID : ID of the device
    Body:
        raw encrypted payload (AES-GCM, base64)
    """
    # 1. Get encrypted payload
    payload = request.get_data(as_text=True)

    # 2. Get device ID from header
    device_id = request.headers.get("X-Device-ID")
    if not device_id:
        return jsonify({"error": "Missing X-Device-ID header"}), 400

    # 3. Validate device in Postgres
    device = Device.query.filter_by(device_id=device_id).first()
    if not device:
        return jsonify({"error": "Unknown device"}), 400
    
    # 5. Ensure device_id and timestamp are set
    payload["device_id"] = device_id
    payload["device_name"]= device.name
    payload["timestamp"] = datetime.now(timezone.utc)

    # 6. Index to Elasticsearch
    es = current_app.elasticsearch
    event_type = payload.get("event_type")
    if event_type == "network":
        es.index(index="network-events", document=payload)
    elif event_type == "file":
        es.index(index="file-events", document=payload)
    else:
        return jsonify({"error": "Invalid event_type"}), 400

    return jsonify({"status": "success"}), 201

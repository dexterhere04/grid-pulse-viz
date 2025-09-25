# app/routes/devices.py
from flask import Blueprint, request, jsonify
from app.models import Device, db
from datetime import datetime, timezone

devices_bp = Blueprint("devices", __name__)

# --- Get all devices ---
@devices_bp.route("/", methods=["GET"])
def get_devices():
    devices = Device.query.all()
    data = [
        {
            "id": d.id,
            "device_id": d.device_id,
            "name": d.name,
            "status": d.status,
            "created_at": d.created_at.isoformat(),
        } for d in devices
    ]
    return jsonify(data), 200

# --- Get a single device ---
@devices_bp.route("/<device_id>", methods=["GET"])
def get_device(device_id):
    device = Device.query.filter_by(device_id=device_id).first()
    if not device:
        return jsonify({"error": "Device not found"}), 404
    data = {
        "id": device.id,
        "device_id": device.device_id,
        "name": device.name,
        "status": device.status,
        "created_at": device.created_at.isoformat(),
    }
    return jsonify(data), 200

# --- Add a new device ---
@devices_bp.route("/", methods=["POST"])
def add_device():
    data = request.get_json()
    if not data or "device_id" not in data or "name" not in data:
        return jsonify({"error": "device_id and name required"}), 400

    existing = Device.query.filter_by(device_id=data["device_id"]).first()
    if existing:
        return jsonify({"error": "Device already exists"}), 400

    device = Device(
        device_id=data["device_id"],
        name=data["name"],
        status=data.get("status", "offline"),
        created_at=datetime.now(timezone.utc)
    )
    db.session.add(device)
    db.session.commit()
    return jsonify({"message": "Device added successfully"}), 201

# --- Update a device ---
@devices_bp.route("/<device_id>", methods=["PUT"])
def update_device(device_id):
    device = Device.query.filter_by(device_id=device_id).first()
    if not device:
        return jsonify({"error": "Device not found"}), 404

    data = request.get_json()
    if "name" in data:
        device.name = data["name"]
    if "status" in data:
        device.status = data["status"]

    db.session.commit()
    return jsonify({"message": "Device updated successfully"}), 200

# --- Delete a device ---
@devices_bp.route("/<device_id>", methods=["DELETE"])
def delete_device(device_id):
    device = Device.query.filter_by(device_id=device_id).first()
    if not device:
        return jsonify({"error": "Device not found"}), 404

    db.session.delete(device)
    db.session.commit()
    return jsonify({"message": "Device deleted successfully"}), 200

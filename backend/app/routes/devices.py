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
            "capacity": d.capacity,
            "location": d.location,
            "manufacturer": d.manufacturer,
            "model": d.model,
            "tilt": d.tilt,
            "azimuth": d.azimuth,
            "status": d.status,
            "created_at": d.created_at.isoformat(),
        }
        for d in devices
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
        "capacity": device.capacity,
        "location": device.location,
        "manufacturer": device.manufacturer,
        "model": device.model,
        "tilt": device.tilt,
        "azimuth": device.azimuth,
        "status": device.status,
        "created_at": device.created_at.isoformat(),
    }
    return jsonify(data), 200

# --- Add a new device ---
@devices_bp.route("/", methods=["POST"])
def add_device():
    data = request.get_json()
    required_fields = ["device_id", "name", "capacity", "tilt", "azimuth"]
    if not data or not all(field in data for field in required_fields):
        return jsonify({"error": f"Missing required fields: {', '.join(required_fields)}"}), 400

    if Device.query.filter_by(device_id=data["device_id"]).first():
        return jsonify({"error": "Device already exists"}), 400

    device = Device(
        device_id=data["device_id"],
        name=data["name"],
        capacity=data["capacity"],
        location=data.get("location", ""),
        manufacturer=data.get("manufacturer", ""),
        model=data.get("model", ""),
        tilt=data["tilt"],
        azimuth=data["azimuth"],
        status=data.get("status", "offline"),
        created_at=datetime.now(timezone.utc),
    )
    db.session.add(device)
    db.session.commit()

    return jsonify({"message": "Device added successfully", "device": {
        "device_id": device.device_id,
        "name": device.name,
        "capacity": device.capacity,
        "location": device.location,
        "manufacturer": device.manufacturer,
        "model": device.model,
        "tilt": device.tilt,
        "azimuth": device.azimuth,
        "status": device.status,
        "created_at": device.created_at.isoformat(),
    }}), 201

# --- Update a device ---
@devices_bp.route("/<device_id>", methods=["PUT"])
def update_device(device_id):
    device = Device.query.filter_by(device_id=device_id).first()
    if not device:
        return jsonify({"error": "Device not found"}), 404

    data = request.get_json()
    updatable_fields = ["name", "status", "capacity", "location", "manufacturer", "model", "tilt", "azimuth"]
    for field in updatable_fields:
        if field in data:
            setattr(device, field, data[field])

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

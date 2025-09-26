from flask_sqlalchemy import SQLAlchemy
from datetime import datetime , timezone
from pydantic import BaseModel

db = SQLAlchemy()

class Device(db.Model):
    __tablename__ = "devices"
    id = db.Column(db.Integer, primary_key=True)
    device_id = db.Column(db.String(50), unique=True, nullable=False, index=True)
    name = db.Column(db.String(100))
    capacity = db.Column(db.Integer,nullable=False)
    location = db.Column(db.String(100))
    manufacturer = db.Column(db.String(100))
    model = db.Column(db.String(100))
    tilt = db.Column(db.Integer,nullable=False)
    azimuth = db.Column(db.Integer,nullable=False)
    status = db.Column(db.String(20), default="offline")
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
class SensorEventSchema(BaseModel):
    """
    Defines the JSON doc stored in Elasticsearch.
    """
    timestamp: datetime
    obiscode: str
    sensor: str
    metric: str
    value: float
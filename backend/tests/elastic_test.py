# tests/elastic_test.py
import os
import time
from app import create_app
from elasticsearch import Elasticsearch

app = create_app()

with app.app_context():
    # Use env vars defined in docker-compose.yml
    es_host = os.getenv("ES_HOST", "http://localhost:9200")
    es_user = os.getenv("ES_USER", "elastic")
    es_pass = os.getenv("ES_PASSWORD", "0Ji99IlL")  # <- default, override via env

    es = Elasticsearch(
        [es_host],
        basic_auth=(es_user, es_pass)
    )

    # Wait until ES is ready
    for _ in range(20):
        try:
            if es.ping():
                print("✅ Elasticsearch is ready")
                break
        except Exception as e:
            print("Waiting for Elasticsearch:", e)
        time.sleep(3)
    else:
        raise Exception("❌ Elasticsearch not ready")

    # Example CRUD test
    doc = {"device_id": "123", "event_type": "network", "message": "Test event"}
    res = es.index(index="network-events", document=doc)
    print("Indexed:", res)

    retrieved = es.get(index="network-events", id=res["_id"])
    print("Retrieved:", retrieved["_source"])

    # Clean up
    es.delete(index="network-events", id=res["_id"])
    print("Deleted:", res["_id"])

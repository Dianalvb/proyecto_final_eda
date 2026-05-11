from dotenv import load_dotenv
import os

load_dotenv()

CITY = os.getenv("CITY")
DEFAULT_SPEED_KMH = float(os.getenv("DEFAULT_SPEED_KMH"))
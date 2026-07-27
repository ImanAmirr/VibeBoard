from dotenv import load_dotenv
load_dotenv()

from backend.main import flashback_job

if __name__ == "__main__":
    flashback_job()
import logging


def setup_logging():
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)  # Set to DEBUG or INFO based on your needs

    # Create a StreamHandler to output logs to stdout
    stream_handler = logging.StreamHandler()
    stream_handler.setLevel(logging.INFO)  # Capture all logs

    # Define a logging format
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    stream_handler.setFormatter(formatter)

    # Add the handler to the logger if not already present
    if not logger.hasHandlers():
        logger.addHandler(stream_handler)

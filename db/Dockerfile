FROM postgres:14.7-alpine

EXPOSE ${POSTGRES_PORT}

CMD ["postgres", "-c", "logging_collector=on", "-c", "log_statement=mod"] 

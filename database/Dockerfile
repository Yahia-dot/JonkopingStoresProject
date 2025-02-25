FROM postgres:latest

# Set environment variables for PostgreSQL
ENV POSTGRES_USER=admin
ENV POSTGRES_PASSWORD=admin
ENV POSTGRES_DB=storesdb

# Copy schema and data
COPY . .

# Expose PostgreSQL port
EXPOSE 5432


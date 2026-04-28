# Use a lightweight Nginx image to serve static files
FROM nginx:alpine

# Copy the static files to the Nginx html directory
COPY . /usr/share/nginx/html

# Cloud Run dynamically assigns a port via the PORT environment variable.
# We overwrite the default Nginx config to listen on this exact port.
CMD echo "server { listen $PORT; location / { root /usr/share/nginx/html; index index.html; } }" > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'

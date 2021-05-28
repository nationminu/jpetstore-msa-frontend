FROM node:16-alpine
ENV NODE_ENV "production"
ENV PORT 8080
EXPOSE 8080 
RUN apk update && \
    apk add --no-cache bash git && \ 
    addgroup ghost && adduser -D -G ghost ghost && \
    mkdir -p /usr/app/ && \
    chown -R ghost /usr/app/

# Prepare app directory
WORKDIR /usr/app/jpetstore/ 
RUN git clone https://github.com/nationminu/jpetstore-msa-frontend.git /usr/app/jpetstore \
    && chown -R ghost /usr/app/jpetstore/ 

USER ghost
RUN yarn install 

# Start the app 
CMD ["/usr/local/bin/npm", "start"]

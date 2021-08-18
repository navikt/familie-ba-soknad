FROM alpine:3 as builder

ARG git_commit

RUN apk add git go
RUN git clone https://github.com/nais/jwker.git \
    && cd /jwker \
    && git checkout $git_commit

WORKDIR /jwker
RUN go build -o jwker cmd/generateJWK/main.go


FROM alpine:3 as runner
RUN apk add python3
COPY --from=builder /jwker/jwker /jwker
COPY ./token_generator.py /token_generator.py
RUN chmod +x /token_generator.py

CMD ["/token_generator.py"]
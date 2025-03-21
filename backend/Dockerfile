# 构建阶段
FROM rust:1.85.0 AS builder

WORKDIR /usr/src/app

# 只复制构建必需的文件
COPY Cargo.toml Cargo.lock ./
COPY src ./src
COPY .env ./

# 构建项目
RUN cargo build --release

# 运行阶段
FROM debian:bookworm-slim

WORKDIR /usr/local/bin

# 安装必要的系统库
RUN apt-get update && \
    apt-get install -y --no-install-recommends libssl-dev ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# 只复制二进制文件，不复制 .pdb 文件
COPY --from=builder /usr/src/app/target/release/rust_advent ./backend

# 确保二进制文件存在且可执行
RUN ls -l backend && chmod +x backend

# 设置环境变量
ENV RUST_LOG=info

# 复制环境文件
COPY --from=builder /usr/src/app/.env .

# 暴露端口
EXPOSE 3000

# 运行应用
CMD ["./backend"] 

# docker run -d --name nyu-backend-app -p 3000:3000 -e RUST_LOG=info nyu-backend  
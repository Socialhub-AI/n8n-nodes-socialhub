FROM registry.easesaas.com/myron/n8nio-n8n:1.109.2

# 把编译后的 dist 拷进默认扫描目录
USER root
RUN mkdir -p /root/.n8n/custom
COPY dist/nodes /root/.n8n/custom/nodes
COPY dist/credentials /root/.n8n/custom/credentials
RUN chown -R root:root /root/.n8n
USER node
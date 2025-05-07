
GOOGLE_GENAI_USE_VERTEXAI=TRUE
GOOGLE_CLOUD_PROJECT=learnie-459115
GOOGLE_CLOUD_LOCATION=us-central1
SERVICE_NAME=learnie
APP_NAME=tutor-agent
AGENT_PATH=tutor_agent

adk deploy cloud_run \
--project=$GOOGLE_CLOUD_PROJECT \
--region=$GOOGLE_CLOUD_LOCATION \
--service_name=$SERVICE_NAME \
--app_name=$APP_NAME \
--with_ui \
$AGENT_PATH

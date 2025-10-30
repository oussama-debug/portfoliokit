defmodule ApiWeb.UserSessionHTML do
  use ApiWeb, :html

  embed_templates "user_session_html/*"

  defp local_mail_adapter? do
    Application.get_env(:api, Api.Mailer)[:adapter] == Swoosh.Adapters.Local
  end
end

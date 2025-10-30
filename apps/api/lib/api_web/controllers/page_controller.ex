defmodule ApiWeb.PageController do
  use ApiWeb, :controller

  def home(conn, _params) do
    render(conn, :home)
  end
end

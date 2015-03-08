defmodule Firework.FireworkChannel do
  use Phoenix.Channel

  def join("firework:events", _message, socket) do
    {:ok, socket}
  end

  def handle_in("new:firework", message, socket) do
    broadcast! socket, "new:firework", message
  end

  def leave(_reason, socket) do
    {:ok, socket}
  end
end

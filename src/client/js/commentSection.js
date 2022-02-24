import { async } from "regenerator-runtime";
import fetch from "node-fetch";

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const videoComment = document.getElementById("videoComment");
const deleteComment = document.getElementById("deleteComment");

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const deleteButton = document.createElement("button");
  deleteButton.className = "fas fa-trash-alt";
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(deleteButton);
  videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }

  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  textarea.value = "";
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

const handleDeleteButton = async (event) => {
  event.preventDefault();
  const commentId = videoComment.dataset.id;
  const response = await fetch(`/api/videos/${commentId}/delete-comment`, {
    method: "DELETE",
  });
  if (response.status === 201) {
    let willBeRemoved = document.getElementById(commentId);
    videoComment.remove(willBeRemoved);
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
if (videoComment) {
  deleteComment.addEventListener("click", handleDeleteButton);
}

import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Client from "./Client";
import Editor from "./Editor";
import { initSocket } from "../socket";
import {
	useNavigate,
	Navigate,
	useLocation,
	useParams,
} from "react-router-dom";

function EditorPage() {
	const [clients, setClinet] = useState([]);

	const socketRef = useRef(null);
	const location = useLocation();
	const navigate = useNavigate();
	const { roomId } = useParams();

	useEffect(() => {
		const init = async () => {
			socketRef.current = await initSocket();

			socketRef.current.on("connect_error", (err) => handleError(err));
			// socketRef.current.on("connect_failed", (err) => handleError(err));                // was used in older versions no longer relevant

			const handleError = (e) => {
				console.log("Socket Error: ", e);
				toast.error("Socket connection failed!");
				navigate("/");
			};

			socketRef.current.emit("join", {
				roomId,
				username: location.state?.username,
			});

			socketRef.current.on("joined", ({ clients, username, socketId }) => {
				if (username !== location.state?.username) {
					toast.success(`${username} joined`);
				}
				setClinet(clients);
			});

			// disconnected
			socketRef.current.on("disconnected", ({ socketId, username }) => {
				toast.success(`${username} left the room`);
				setClinet((prev) => {
					return prev.filter((client) => client.socketId !== socketId);                // filters out the client whose socketId matches the disconnected socket
				});
			});
		};

		init();

		return () => {                                        // runs when the component unmounts. Component unmounts when the user leaves the editor page.
			socketRef.current.disconnect();
			socketRef.current.off("joined");                  // Prevents memory leaks
			socketRef.current.off("disconnected");
		};
	}, []);

	if (!location.state) {
		return <Navigate to={"/"} />;
	}

	return (
		<div className="container-fluid vh-100">
			<div className="row h-100">
				<div
					className="col-md-2 bg-dark text-light d-flex flex-column h-100"
					style={{ boxShadow: "2px 0px 4px rgba(0,0,0,0.1)" }}
				>
					<img
						src="/images/SyncScript.png"
						alt="scyncscript"
						className="img-fluid mx-auto"
						style={{ maxWidth: "200px", marginTop: "-25px" }}
					/>
					<hr style={{ marginTop: "-2rem" }} />

					{/* client list container */}
					<div className="d-flex flex-column overflow-auto">
						{clients.map((client) => (
							<Client key={client.socketId} username={client.username} />
						))}
					</div>

					{/* Buttons */}
					<div className="mt-auto">
						<hr />
						<button className="btn btn-success">Copy Room Id</button>
						<button className="btn btn-danger mt-2 mb-2 px-3 btn-block">
							Leave Room
						</button>
					</div>
				</div>
				{/* Editor */}
				<div className="col-md-10 text-light d-flex flex-column h-100 vh-100">
					<Editor />
				</div>
			</div>
		</div>
	);
}

export default EditorPage;

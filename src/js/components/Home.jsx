import React, { useState } from "react";

let Home = () => {
	const [todo, setTodo] = useState("");
	const [list, setList] = useState([]);
	const username = "robertaval";

	const createUsername = async () => {
		try {
			const response = await fetch(`https://playground.4geeks.com/todo/users/${username}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify([])
			});
			await response.json();
			console.log("User created successfully.");
		} catch (error) {
			console.error("Error creating user:", error);
		}
	};

	const fetchChores = async () => {
		try {
			const response = await fetch(`https://playground.4geeks.com/todo/users/${username}`);
			if (response.status === 404) {
				console.warn("User not found. Creating...");
				await createUsername();
				return fetchChores(); 
			}

			const data = await response.json();
			if (Array.isArray(data.todos)) {
				setList(data.todos);
			}
		} catch (error) {
			console.error("Fetch error:", error);
		}
	};

	const createChore = (choreLabel) => {
		fetch(`https://playground.4geeks.com/todo/todos/${username}`, {
			method: "POST",
			body: JSON.stringify({ label: choreLabel, is_done: false }),
			headers: { "Content-Type": "application/json" }
		})
			.then(resp => {
				console.log(resp.ok);
				console.log(resp.status);
				return resp.json();
			})
			.then(data => {
				console.log("Task created:", data);
				setTodo("");
				fetchChores();
			})
			.catch(error => console.error("Error creating chore:", error));
	};

	const handleDel = (choreId) => {
		fetch(`https://playground.4geeks.com/todo/todos/${choreId}`, {
			method: "DELETE"
		})
			.then(() => fetchChores())
			.catch(error => console.error("There was an error deleting chore:", error));
	};

	const clearAll = async () => {
		try {
			await Promise.all(
				list.map((chore) =>
					fetch(`https://playground.4geeks.com/todo/todos/${chore.id}`, {
						method: "DELETE"
					})
				)
			);
			fetchChores();
		} catch (error) {
			console.error("Error clearing tasks:", error);
		}
	};

	return (
		<div className="container py-4">
			<p className="text-center fs-3 fw-bold">My To Dos</p>

			<form
				onSubmit={(event) => {
					event.preventDefault();
					if (todo.trim() === "") return;
					createChore(todo);
				}}
				className="card p-3 mx-auto"
				style={{ maxWidth: "600px" }}
			>
				<div className="mb-3 d-flex gap-2">
					<input
						type="text"
						className="form-control"
						placeholder="Escribe una tarea"
						value={todo}
						onChange={(event) => setTodo(event.target.value)}
					/>
					<button type="submit" className="btn btn-primary">
						Add Todo
					</button>
				</div>

				<ul className="list-group">
					{list.map((chore) => (
						<li key={chore.id} className="list-group-item d-flex justify-content-between align-items-center">
							{chore.label}
							<button
								className="btn btn-sm btn-outline-danger"
								onClick={() => handleDel(chore.id)}
							>
								Delete
							</button>
						</li>
					))}
					{list.length > 0 && (
						<li className="list-group-item text-muted">
							{list.length} tarea{list.length !== 1 && "s"} pendiente{list.length !== 1 && "s"}
						</li>
					)}
				</ul>

				<div className="mt-3 d-flex justify-content-between">
					<button className="btn btn-success" onClick={fetchChores}>
						Get Todos
					</button>
					<button className="btn btn-danger" onClick={clearAll}>
						Clear All Tasks
					</button>
				</div>
			</form>
		</div>
	);
};

export default Home;

import { StatusBar } from 'expo-status-bar';
//import React from 'react';
import { StyleSheet, Text, Button, View } from 'react-native';
import React, { useEffect } from 'react';
import Header from './src/Header.js';
import TodoList from './src/TodoList.js';
import api from './src/utils/api.js';
import { SafeAreaView } from 'react-native';
import uuid from 'node-uuid';

export default function App() {

  const [restTodos, setRestTodos] = React.useState([]);

	const addRestTodo = async (text) => {
		try {
			await api.addRestTodo({
				id: uuid.v1(),
				completed: false,
				text: text,
				key: 'rest',
			})
			getRestTodos();
		} catch (error) {
			console.log(error) 
		}
	};

	const deleteRestTodo = async (id) => {
		try {
			await api.deleteRestTodo(id);
			console.log("todos", restTodos)
			getRestTodos();
		} catch (error) {
			console.log(error) 
		}
	};

	const completeRestTodo = async (id, text, completed) => {
		try {
			await api.updateRestTodo({
				id,
				text,
				completed: !completed,
			});
			getRestTodos();
		} catch (error) {
			console.log(error) 
		}
	};

	useEffect(() => {
		getRestTodos();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		//console.log("STATE Change:", restTodos)
	}, [restTodos]);

	const getRestTodos = async () => {
		// Reload the todo list from the database to see the latest changes
		api.getRestTodos().then((restTodos) => setRestTodos( restTodos ));
	};

	const clearRestCompleted = async () => {
		let docTodos = api.getRestTodos();
		docTodos.forEach((todo) => {
			completeRestTodo(todo.id, todo.text, true);
		});
	};

	const actions = {
		addRestTodo: addRestTodo,
		completeRestTodo: completeRestTodo,
		clearRestCompleted: clearRestCompleted,
		getRestTodos: getRestTodos,
		deleteRestTodo: deleteRestTodo,
	};


  return (
	<SafeAreaView style={{flex: 1}}>
		<View style={styles.todos}>
				<Header title="REST todos" addTodo={actions.addRestTodo}  type="rest"/>
				<TodoList type="rest" todos={restTodos} actions={actions} />
		</View>
	</SafeAreaView>

  );
}

const styles = StyleSheet.create({
  todos: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    //alignItems: 'center',
    justifyContent: 'center',
  },

});


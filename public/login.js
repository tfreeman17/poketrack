
		function tryToLogin() {
			$.post('/api/login',
			{
				username: $('#username').val(),
				password: $('#password').val()
			}, function(data) {
				if (data === "success"){
					document.location = "/map";
				} else {
					$('#error').html("NOPE!");
				}
			});
		}

		function tryToRegister() {
			$.post('/api/register',
			{
				username: $('#username').val(),
				password: $('#password').val()
			}, function(data) {
				if (data === "success"){
					document.location = "/map";
				} else {
					$('#error').html("NOPE!");
				}
			});
		}

		$(document).ready(function() {
			$('#submit').click(tryToLogin);
			$('#register').click(tryToRegister);
		});
// 	// 
// <body>
// 	<h1>Login</h1>
// 	<input type="text" id="username">
// 	<input type="password" id="password">
// 	<input type="button" id="submit" value="login">
// 	<input type="button" id="register" value="register">
// 	<div id="error"></div>
// </body>
// </html>

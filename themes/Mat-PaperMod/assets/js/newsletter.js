const form_container = document.getElementById("cm--form"),
	form = document.getElementById("newsletter-form"),
	name_input = document.getElementById("name-input"),
	email_input = document.getElementById("email-input"),
	control_input = document.querySelector(
		"[name='b_9c6b2f17e7035fe1df293fdaa_8651a673a9']"
	);
submit_btn = document.getElementById("submit-btn");

const touched_map = {
	name: false,
	email: false,
};

const validation_map = {
	name: false,
	email: false,
	control_input: false,
};

const validate_name = (name_value) =>
	/^[a-zA-ZÀ-ÿ][\sa-zA-ZÀ-ÿ]*$/.test(name_value);

const validate_email = (email_value) =>
	/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
		String(email_value).toLowerCase()
	);

const validation = (value, key, validation_func, err_class) => {
	const is_valid = validation_func(value.trim());

	if ((!touched_map[key] && !is_valid) || (validation_map[key] && !is_valid)) {
		form_container.classList.add(err_class);
	} else if (!validation_map[key] && is_valid) {
		form_container.classList.remove(err_class);
	}

	if (!touched_map[key]) touched_map[key] = true;
	validation_map[key] = is_valid;
};

name_input.addEventListener("focusout", (event) => {
	validation(event.target.value, "name", validate_name, "name-err");
});

email_input.addEventListener("focusout", (event) => {
	validation(event.target.value, "email", validate_email, "email-err");
});

submit_btn.addEventListener("click", (event) => {
	event.preventDefault();
	const name_value = name_input.value,
		email_value = email_input.value;

	// validating all fields
	validation(name_value, "name", validate_name, "name-err");
	validation(email_value, "email", validate_email, "email-err");

	// check the control input for bots
	validation_map.control_input = !control_input.value;

	// cheking
	if (!validation_map.name) {
		name_input.focus();
	} else if (!validation_map.email) {
		email_input.focus();
	} else if (!validation_map.control_input) {
		alert(
			"Si è verificato un errore, riprovare. Se il problema persiste è perché sei stato indentificato come un robot, i quali non hanno accesso al link di iscrizione alla newsletter."
		);
	} else {
		form.submit();
	}
});

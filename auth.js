const SUPABASE_URL =
    "https://lkhzhobvppofowxipwiz.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "PASTE_YOUR_CURRENT_PUBLISHABLE_KEY_HERE";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


// REGISTER

async function registerUser(event) {

    event.preventDefault();

    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    const message =
        document.getElementById("message");

    const button =
        document.getElementById("registerButton");


    if (password !== confirmPassword) {

        message.textContent =
            "Passwords do not match.";

        return;
    }


    if (password.length < 6) {

        message.textContent =
            "Password must be at least 6 characters.";

        return;
    }


    button.disabled = true;

    button.textContent =
        "CREATING ACCOUNT...";


    const { data, error } =
        await supabaseClient.auth.signUp({

            email: email,

            password: password,

            options: {

                data: {

                    full_name: name

                }

            }

        });


    if (error) {

        console.error(error);

        message.textContent =
            error.message;

        button.disabled = false;

        button.textContent =
            "CREATE ACCOUNT";

        return;
    }


    if (data.user && !data.session) {

        message.textContent =
            "Account created! Check your email to confirm your account.";

        button.disabled = false;

        button.textContent =
            "ACCOUNT CREATED";

        return;
    }


    if (data.session) {

        window.location.href =
            "dashboard.html";

    }

}


// LOGIN

async function loginUser(event) {

    event.preventDefault();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    const message =
        document.getElementById("message");

    const button =
        document.getElementById("loginButton");


    button.disabled = true;

    button.textContent =
        "LOGGING IN...";


    const { data, error } =
        await supabaseClient.auth.signInWithPassword({

            email: email,

            password: password

        });


    if (error) {

        console.error(error);

        message.textContent =
            error.message;

        button.disabled = false;

        button.textContent =
            "LOGIN";

        return;
    }


    if (data.user) {

        window.location.href =
            "dashboard.html";

    }

}


// LOGOUT

async function logoutUser() {

    await supabaseClient.auth.signOut();

    window.location.href =
        "login.html";

}


// PROTECT DASHBOARD

async function protectDashboard() {

    const {
        data: { user }
    } =
        await supabaseClient.auth.getUser();


    if (!user) {

        window.location.href =
            "login.html";

        return;
    }


    const name =
        user.user_metadata?.full_name ||
        "Member";


    const nameElement =
        document.getElementById("userName");

    const emailElement =
        document.getElementById("userEmail");


    if (nameElement) {

        nameElement.textContent =
            name;
    }


    if (emailElement) {

        emailElement.textContent =
            user.email;
    }

}


// CONNECT FORMS

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const registerForm =
            document.getElementById("registerForm");

        if (registerForm) {

            registerForm.addEventListener(
                "submit",
                registerUser
            );

        }


        const loginForm =
            document.getElementById("loginForm");

        if (loginForm) {

            loginForm.addEventListener(
                "submit",
                loginUser
            );

        }

    }
);

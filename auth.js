// ============================================
// MJMMGLOBAL - SUPABASE AUTHENTICATION
// ============================================

const SUPABASE_URL =
    "https://lkhzhobvppofowxipwiz.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "PASTE_YOUR_SUPABASE_PUBLISHABLE_KEY_HERE";


// Create Supabase client
const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


// ============================================
// REGISTER
// ============================================

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


    if (name === "") {

        message.textContent =
            "Please enter your full name.";

        return;
    }


    if (email === "") {

        message.textContent =
            "Please enter your email.";

        return;
    }


    if (password.length < 6) {

        message.textContent =
            "Password must be at least 6 characters.";

        return;
    }


    if (password !== confirmPassword) {

        message.textContent =
            "Passwords do not match.";

        return;
    }


    button.disabled = true;

    button.textContent =
        "CREATING ACCOUNT...";


    message.textContent =
        "Please wait...";


    try {

        const result =
            await supabaseClient.auth.signUp({

                email: email,

                password: password,

                options: {

                    data: {

                        full_name: name

                    }

                }

            });


        const data = result.data;

        const error = result.error;


        if (error) {

            console.error(
                "SUPABASE ERROR:",
                error
            );

            message.textContent =
                error.message;

            button.disabled = false;

            button.textContent =
                "CREATE ACCOUNT";

            return;
        }


        if (data.user && !data.session) {

            message.textContent =
                "Account created successfully. Please check your email and confirm your account.";

            button.disabled = false;

            button.textContent =
                "ACCOUNT CREATED";

            return;
        }


        if (data.session) {

            window.location.href =
                "dashboard.html";

            return;
        }


    } catch (error) {

        console.error(error);

        message.textContent =
            "Unable to connect to Supabase.";

        button.disabled = false;

        button.textContent =
            "CREATE ACCOUNT";
    }

}


// ============================================
// LOGIN
// ============================================

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


    if (email === "") {

        message.textContent =
            "Please enter your email.";

        return;
    }


    if (password === "") {

        message.textContent =
            "Please enter your password.";

        return;
    }


    button.disabled = true;

    button.textContent =
        "LOGGING IN...";


    try {

        const result =
            await supabaseClient.auth.signInWithPassword({

                email: email,

                password: password

            });


        const data = result.data;

        const error = result.error;


        if (error) {

            console.error(
                "SUPABASE LOGIN ERROR:",
                error
            );

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

            return;
        }


    } catch (error) {

        console.error(error);

        message.textContent =
            "Unable to connect to Supabase.";

        button.disabled = false;

        button.textContent =
            "LOGIN";
    }

}


// ============================================
// LOGOUT
// ============================================

async function logoutUser() {

    try {

        const { error } =
            await supabaseClient.auth.signOut();


        if (error) {

            alert(error.message);

            return;
        }


        window.location.href =
            "login.html";


    } catch (error) {

        console.error(error);

        alert(
            "Unable to logout."
        );
    }

}


// ============================================
// PROTECT DASHBOARD
// ============================================

async function protectDashboard() {

    try {

        const {
            data: {
                user
            },
            error
        } =
            await supabaseClient.auth.getUser();


        if (error || !user) {

            window.location.href =
                "login.html";

            return;
        }


        const name =
            user.user_metadata?.full_name ||
            "Member";


        const userName =
            document.getElementById(
                "userName"
            );

        const userEmail =
            document.getElementById(
                "userEmail"
            );


        if (userName) {

            userName.textContent =
                name;
        }


        if (userEmail) {

            userEmail.textContent =
                user.email;
        }


    } catch (error) {

        console.error(error);

        window.location.href =
            "login.html";
    }

}


// ============================================
// CONNECT FORMS
// ============================================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        const registerForm =
            document.getElementById(
                "registerForm"
            );


        if (registerForm) {

            registerForm.addEventListener(
                "submit",
                registerUser
            );

        }


        const loginForm =
            document.getElementById(
                "loginForm"
            );


        if (loginForm) {

            loginForm.addEventListener(
                "submit",
                loginUser
            );

        }

    }
);

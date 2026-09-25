// =========================================
// MJMMGLOBAL AUTHENTICATION SYSTEM
// =========================================

// SUPABASE CONFIGURATION

const SUPABASE_URL =
    "https://lkhzhobvppofowxipwiz.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "YOUR_PUBLISHABLE_KEY";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


// =========================================
// REGISTER USER
// =========================================

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

    message.textContent = "";

    if (!name) {
        message.textContent =
            "Please enter your full name.";
        return;
    }

    if (!email) {
        message.textContent =
            "Please enter your email address.";
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
        "Creating your MJMMGLOBAL account...";

    try {

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
                "Account created successfully! Please check your email and confirm your account before logging in.";

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
            "Something went wrong. Please try again.";

        button.disabled = false;

        button.textContent =
            "CREATE ACCOUNT";
    }
}


// =========================================
// LOGIN USER
// =========================================

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

    message.textContent =
        "Signing you in...";

    button.disabled = true;

    button.textContent =
        "LOGGING IN...";

    try {

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

    } catch (error) {

        console.error(error);

        message.textContent =
            "Something went wrong. Please try again.";

        button.disabled = false;

        button.textContent =
            "LOGIN";
    }
}


// =========================================
// LOGOUT
// =========================================

async function logoutUser() {

    const { error } =
        await supabaseClient.auth.signOut();

    if (error) {

        alert(error.message);

        return;
    }

    window.location.href =
        "login.html";
}


// =========================================
// PROTECT DASHBOARD
// =========================================

async function protectDashboard() {

    try {

        const {
            data: { user },
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
                user.email || "";
        }

    } catch (error) {

        console.error(error);

        window.location.href =
            "login.html";
    }
}


// =========================================
// AUTOMATIC FORM CONNECTION
// =========================================

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

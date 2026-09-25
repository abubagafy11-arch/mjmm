// =========================================
// MJMMGLOBAL AUTHENTICATION SYSTEM
// =========================================


// =========================================
// SUPABASE CONFIGURATION
// =========================================

const SUPABASE_URL =
    "https://lkhzhobvppofowxipwiz.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "PASTE_YOUR_PUBLISHABLE_KEY_HERE";


// Create Supabase client

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


    // Clear previous message

    message.textContent = "";


    // Check name

    if (!name) {

        message.textContent =
            "Please enter your full name.";

        return;
    }


    // Check email

    if (!email) {

        message.textContent =
            "Please enter your email address.";

        return;
    }


    // Check password

    if (!password) {

        message.textContent =
            "Please create a password.";

        return;
    }


    // Minimum password length

    if (password.length < 6) {

        message.textContent =
            "Password must be at least 6 characters.";

        return;
    }


    // Confirm password

    if (!confirmPassword) {

        message.textContent =
            "Please confirm your password.";

        return;
    }


    // Compare passwords

    if (password !== confirmPassword) {

        message.textContent =
            "Passwords do not match.";

        return;
    }


    // Disable button

    button.disabled = true;

    button.textContent =
        "CREATING ACCOUNT...";


    message.textContent =
        "Creating your MJMMGLOBAL account...";


    try {


        // Create Supabase account

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


        // Check for error

        if (error) {

            console.error(
                "Registration error:",
                error
            );

            message.textContent =
                error.message;

            button.disabled = false;

            button.textContent =
                "CREATE ACCOUNT";

            return;
        }


        // Email confirmation required

        if (data.user && !data.session) {

            message.textContent =
                "Account created successfully! Please check your email and confirm your account before logging in.";

            button.disabled = false;

            button.textContent =
                "ACCOUNT CREATED";

            return;
        }


        // User is automatically logged in

        if (data.session) {

            window.location.href =
                "dashboard.html";

            return;
        }


    } catch (error) {

        console.error(
            "Unexpected registration error:",
            error
        );

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


    message.textContent = "";


    // Check email

    if (!email) {

        message.textContent =
            "Please enter your email address.";

        return;
    }


    // Check password

    if (!password) {

        message.textContent =
            "Please enter your password.";

        return;
    }


    button.disabled = true;

    button.textContent =
        "LOGGING IN...";


    message.textContent =
        "Signing you in...";


    try {


        // Login with Supabase

        const { data, error } =
            await supabaseClient.auth.signInWithPassword({

                email: email,

                password: password

            });


        // Login error

        if (error) {

            console.error(
                "Login error:",
                error
            );

            message.textContent =
                error.message;

            button.disabled = false;

            button.textContent =
                "LOGIN";

            return;
        }


        // Login successful

        if (data.user) {

            window.location.href =
                "dashboard.html";

            return;
        }


    } catch (error) {

        console.error(
            "Unexpected login error:",
            error
        );

        message.textContent =
            "Something went wrong. Please try again.";

        button.disabled = false;

        button.textContent =
            "LOGIN";
    }

}


// =========================================
// LOGOUT USER
// =========================================

async function logoutUser() {

    try {


        const { error } =
            await supabaseClient.auth.signOut();


        if (error) {

            console.error(
                "Logout error:",
                error
            );

            alert(error.message);

            return;
        }


        window.location.href =
            "login.html";


    } catch (error) {

        console.error(
            "Unexpected logout error:",
            error
        );

        alert(
            "Unable to logout. Please try again."
        );
    }

}


// =========================================
// PROTECT DASHBOARD
// =========================================

async function protectDashboard() {

    try {


        const {
            data: {
                user
            },
            error
        } =
            await supabaseClient.auth.getUser();


        // User is not logged in

        if (error || !user) {

            window.location.href =
                "login.html";

            return;
        }


        // Get user's name

        const name =
            user.user_metadata?.full_name ||
            "Member";


        // Find dashboard elements

        const nameElement =
            document.getElementById(
                "userName"
            );

        const emailElement =
            document.getElementById(
                "userEmail"
            );


        // Display name

        if (nameElement) {

            nameElement.textContent =
                name;
        }


        // Display email

        if (emailElement) {

            emailElement.textContent =
                user.email || "";
        }


    } catch (error) {

        console.error(
            "Dashboard protection error:",
            error
        );

        window.location.href =
            "login.html";
    }

}


// =========================================
// CHECK CURRENT USER
// =========================================

async function getCurrentUser() {

    try {


        const {
            data: {
                user
            },
            error
        } =
            await supabaseClient.auth.getUser();


        if (error) {

            console.error(
                "User check error:",
                error
            );

            return null;
        }


        return user;


    } catch (error) {

        console.error(
            "Unexpected user check error:",
            error
        );

        return null;
    }

}


// =========================================
// AUTOMATIC FORM CONNECTION
// =========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        // Registration form

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


        // Login form

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

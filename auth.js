const SUPABASE_URL = "https://lkhzhobvppofowxipwiz.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = "PASTE_YOUR_SB_PUBLISHABLE_KEY_HERE";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


// ================= REGISTER =================

async function registerUser(event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const message = document.getElementById("message");

    message.textContent = "";

    if (!name || !email || !password) {
        message.textContent = "Please fill in all fields.";
        return;
    }

    if (password.length < 6) {
        message.textContent =
            "Password must be at least 6 characters.";
        return;
    }

    message.textContent = "Creating your account...";

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
        message.textContent = error.message;
        return;
    }

    if (data.user && !data.session) {
        message.textContent =
            "Account created successfully. Please check your email and confirm your account.";
        return;
    }

    window.location.href = "dashboard.html";
}


// ================= LOGIN =================

async function loginUser(event) {

    event.preventDefault();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    const message =
        document.getElementById("message");

    message.textContent = "Signing you in...";

    const { data, error } =
        await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

    if (error) {
        message.textContent = error.message;
        return;
    }

    if (data.user) {
        window.location.href = "dashboard.html";
    }
}


// ================= LOGOUT =================

async function logoutUser() {

    const { error } =
        await supabaseClient.auth.signOut();

    if (error) {
        alert(error.message);
        return;
    }

    window.location.href = "login.html";
}


// ================= PROTECT DASHBOARD =================

async function protectDashboard() {

    const {
        data: { user }
    } = await supabaseClient.auth.getUser();

    if (!user) {
        window.location.href = "login.html";
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
        nameElement.textContent = name;
    }

    if (emailElement) {
        emailElement.textContent = user.email;
    }
}

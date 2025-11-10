// src/pages/RegisterPage.tsx
import RegisterForm from "../components/auth/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Create Your Account</h2>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
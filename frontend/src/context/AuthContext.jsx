/* import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    
    if (storedToken && storedUsername) {
      setToken(storedToken);
      setUsername(storedUsername);
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setIsAuthenticated(!!token);
  }, [token]);

  const login = (newToken, newUsername) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("username", newUsername);
    setToken(newToken);
    setUsername(newUsername);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("user_id");
    setToken(null);
    setUsername(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ 
      token, 
      isAuthenticated, 
      username, 
      login, 
      logout,
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; */
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [role, setRole] = useState(null); // 👈 role aqui
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const extractRoleFromToken = (jwt) => {
    try {
      const payload = JSON.parse(atob(jwt.split(".")[1]));
      return payload.role ?? null; // 👈 extrai role do JWT
    } catch (err) {
      console.error("Token inválido:", err);
      return null;
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");

    if (storedToken && storedUsername) {
      setToken(storedToken);
      setUsername(storedUsername);
      setRole(extractRoleFromToken(storedToken)); // 👈 define role
      setIsAuthenticated(true);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (token) {
      setRole(extractRoleFromToken(token));
      setIsAuthenticated(true);
    } else {
      setRole(null);
      setIsAuthenticated(false);
    }
  }, [token]);

  const login = (newToken, newUsername) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("username", newUsername);
    setToken(newToken);
    setUsername(newUsername);
    setRole(extractRoleFromToken(newToken)); // 👈 atualiza role no login
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("user_id");
    setToken(null);
    setUsername(null);
    setRole(null); // 👈 limpa role
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider
      value={{
        token,
        username,
        role,            // 👈 disponibiliza role no contexto
        isAuthenticated,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

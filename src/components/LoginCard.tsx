"use client";
import { useState } from "react";
import { TextField, Button, Typography, Box, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";
import Image from "next/image";
import Card from "./Card/Card";

interface LoginCardProps {
  onSubmit?: (email: string, password: string) => void;
}

export default function LoginCard({ onSubmit }: LoginCardProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSubmit?.(email, password);
    }, 1000);
  };

  return (
    <Card>
      {/* ロゴ */}
      <Box sx={{ 
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <Image
          src="logo/logo.svg"
          alt="えほんのたね ロゴ"
          width={64}
          height={64}
          style={{
            filter: "drop-shadow(0 0 10px rgba(255,255,255,0.3))"
          }}
        />
      </Box>

      {/* タイトル */}
      <Typography
        variant="h1"
        component="h2"
        sx={{
          fontWeight: "bold",
          marginBottom: "1.5rem",
          fontSize: "2.5rem",
          background: "linear-gradient(45deg, #ffffff 30%, #e0e7ff 90%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontFamily: "var(--font-yusei-magic), 'Yusei Magic', sans-serif",
        }}
      >
        えほんのたね
      </Typography>

      <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.75)", marginBottom: "0.5rem", fontFamily: "var(--font-yusei-magic), 'Yusei Magic', sans-serif" }}>
        アカウントにログインしてください
      </Typography>

      {/* フォーム */}
      <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", marginTop: "1rem" }}>
        {/* メールアドレス入力 */}
        <TextField
          fullWidth
          label="メールアドレス"
          type="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          required
          sx={{
            marginBottom: "2.0rem",
            transition: "transform 0.2s ease",
            "&:hover": {
              transform: "scale(1.02)"
            },
            "& .MuiOutlinedInput-root": {
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "0.5rem",
              height: "48px",
              "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
              "&:hover fieldset": { borderColor: "rgba(255,255,255,0.3)" },
              "&.Mui-focused fieldset": { borderColor: "#93c5fd" },
            },
            "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.75)" },
            "& .MuiInputBase-input": { color: "white", padding: "12px 14px" },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email sx={{ color: "rgba(255,255,255,0.6)" }} />
              </InputAdornment>
            ),
          }}
        />

        {/* パスワード入力 */}
        <TextField
          fullWidth
          label="パスワード"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          required
          sx={{
            marginBottom: "2.0rem",
            transition: "transform 0.2s ease",
            "&:hover": {
              transform: "scale(1.02)"
            },
            "& .MuiOutlinedInput-root": {
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "0.5rem",
              height: "48px",
              "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
              "&:hover fieldset": { borderColor: "rgba(255,255,255,0.3)" },
              "&.Mui-focused fieldset": { borderColor: "#93c5fd" },
            },
            "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.75)" },
            "& .MuiInputBase-input": { color: "white", padding: "12px 14px" },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock sx={{ color: "rgba(255,255,255,0.6)" }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword((s) => !s)} edge="end" sx={{ color: "rgba(255,255,255,0.7)" }}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* ログインボタン */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isLoading}
          sx={{
            height: "44px",
            borderRadius: "0.5rem",
            background: isLoading
              ? "rgba(102,126,234,0.5)"
              : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            fontWeight: "bold",
            fontSize: "0.9rem",
            textTransform: "none",
            boxShadow: "0 8px 32px rgba(2, 6, 23, 0.35)",
            transition: "transform 0.2s ease, background 0.3s ease, box-shadow 0.3s ease",
            outline: "none", // フォーカス時のアウトラインを削除
            "&:hover": {
              background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
              boxShadow: "0 12px 40px rgba(2, 6, 23, 0.45)",
              transform: "scale(1.02)"
            },
            "&:focus": {
              outline: "none", // フォーカス時のアウトラインを削除
              boxShadow: "0 8px 32px rgba(2, 6, 23, 0.35), 0 0 0 2px rgba(102, 126, 234, 0.3)",
            },
            "&:disabled": {
              background: "rgba(102,126,234,0.35)",
              color: "rgba(255,255,255,0.6)",
            },
          }}
        >
          {isLoading ? "ログイン中..." : "ログイン"}
        </Button>
      </Box>

      {/* リンク */}
      <Box sx={{
        marginTop: "3rem",
        display: "flex",
        justifyContent: "space-between",
        flexDirection: { xs: "column", sm: "row" },
        gap: { xs: "0.5rem", sm: 0 },
        width: "100%"
      }}>
        <Typography
          variant="body2"
          sx={{
            color: "rgba(255,255,255,0.75)",
            cursor: "pointer",
            fontSize: "0.875rem",
            transition: "color 0.3s ease",
            "&:hover": { color: "rgba(255,255,255,0.95)" },
            fontFamily: "var(--font-yusei-magic), 'Yusei Magic', sans-serif",
          }}
        >
          パスワードを忘れた方
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "rgba(255,255,255,0.75)",
            cursor: "pointer",
            fontSize: "0.875rem",
            transition: "color 0.3s ease",
            "&:hover": { color: "rgba(255,255,255,0.95)" },
            fontFamily: "var(--font-yusei-magic), 'Yusei Magic', sans-serif",
          }}
        >
          新規登録
        </Typography>
      </Box>
    </Card>
  );
}
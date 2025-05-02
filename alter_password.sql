
-- Alterar a senha do usuário admin@admin.com para '1234' usando bcrypt
-- Esta versão usa a função pgcrypto do PostgreSQL para gerar o hash bcrypt

UPDATE admin_users
SET password = crypt('1234', gen_salt('bf', 10))
WHERE email = 'admin@admin.com';

-- Verificar se a atualização foi bem-sucedida
SELECT id, name, email, user_type FROM admin_users WHERE email = 'admin@admin.com';

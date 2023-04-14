const mapping: { [key: string]: string } = {
  'User not found': 'Usuario no encontrado',
  'Incorrect password': 'Contraseña incorrecta',
  'Unauthorized': 'Acceso no autorizado',
  'Internal server error': 'Error interno detectado, por favor comunicarse con el Administrador'
};

export function translateHttpMessage(message: string): string {
  return mapping[message] || message;
}

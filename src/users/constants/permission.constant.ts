export const PERMISSION_KEY = 'permissions';

export enum PERMISSION {
  // user
  USER = 'Usuario',
  USER_SHOW = 'Mostrar usuarios',
  ROLE = 'Rol',
  ROLE_SHOW = 'Mostrar roles',
  PERMISSION = 'Permiso',
  PERMISSION_SHOW = 'Mostrar permisos',

  // realstate
  REALSTATE = 'Inmobiliaria',
  REALSTATE_SHOW = 'Mostrar inmobiliarias',
  REALSTATE_CREATE = 'Crear inmobiliarias',
  REALSTATE_UPDATE = 'Actualizar inmobiliarias',
  REALSTATE_DELETE = 'Eliminar inmobiliarias',
  PROPERTY = 'Propiedad',
  PROPERTY_SHOW = 'Mostrar propiedades',
  PROPERTY_CREATE = 'Crear propiedades',
  PROPERTY_UPDATE = 'Actualizar propiedades',
  PROPERTY_DELETE = 'Eliminar propiedades',

  SECTOR = 'Sector',
  SECTOR_SHOW = 'Mostrar sectores',
  SECTOR_CREATE = 'Crear sectores',
  SECTOR_UPDATE = 'Actualizar sectores',
  SECTOR_DELETE = 'Eliminar sectores',

  SUBSCRIPTION = 'Suscripcion',
  // branch
  BRANCH = 'Sucursal',
  BRANCH_SHOW = 'Mostrar sucursales',
}

export function parseId(id: string | string[] | undefined): number | null {
  const str = Array.isArray(id) ? id[0] : id;
  if (str === undefined) return null;
  const parsed = parseInt(str, 10);
  return isNaN(parsed) ? null : parsed;
}

export function getParam(param: string | string[] | undefined): string | undefined {
  return Array.isArray(param) ? param[0] : param;
}

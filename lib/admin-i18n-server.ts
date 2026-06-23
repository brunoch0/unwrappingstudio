import { cookies } from "next/headers";
import {
  ADMIN_LANG_COOKIE,
  translate,
  type AdminLang,
} from "./admin-i18n";

/** Resolve admin language from cookie (server). Defaults to Korean. */
export async function getAdminLang(): Promise<AdminLang> {
  const store = await cookies();
  const v = store.get(ADMIN_LANG_COOKIE)?.value;
  return v === "en" ? "en" : "ko";
}

/** Server helper: returns the language + a bound `t()`. */
export async function getAdminT() {
  const lang = await getAdminLang();
  return { lang, t: (key: string) => translate(lang, key) };
}

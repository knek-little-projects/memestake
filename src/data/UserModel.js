import { strict, nonnull, defined } from "./strict"

export const UserModel = strict(class {
  constructor({
    id,
    username,
    first_name,
    last_name,
    language_code,
    is_premium,
  }) {
    this.id = nonnull(id, "User.id")
    this.username = defined(username, "User.username")
    this.first_name = defined(first_name, "User.first_name")
    this.last_name = defined(last_name, "User.last_name")
    this.language_code = defined(language_code, "User.language_code")
    this.is_premium = defined(is_premium, "User.is_premium")
  }

  static check(data) {
    new UserModel(data)
  }

  serialize() {
    return {
      id: this.id,
      username: this.username,
      first_name: this.first_name,
      last_name: this.last_name,
      language_code: this.language_code,
      is_premium: this.is_premium,
    }
  }
})
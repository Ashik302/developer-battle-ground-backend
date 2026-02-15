export class UpdateUserDTO {
  name?: string;
  email?: string;
  location?: string;
  avatar_url?: string;
  github_url?: string;
  provider?: string;
  github_access_token?: string;
  lat?: number;
  lng?: number;

  constructor(data: Partial<UpdateUserDTO>) {
    this.name = data.name;
    this.email = data.email;
    this.location = data.location;
    this.avatar_url = data.avatar_url;
    this.github_url = data.github_url;
    this.provider = data.provider;
    this.github_access_token = data.github_access_token;
    this.lat = data.lat;
    this.lng = data.lng;
  }

  validate(): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    if (this.name !== undefined) {
      if (typeof this.name !== "string") {
        errors.name = "Name must be a string";
      } else if (this.name.trim().length === 0) {
        errors.name = "Name cannot be empty";
      } else if (this.name.length > 100) {
        errors.name = "Name must not exceed 100 characters";
      }
    }

    // Validate email
    if (this.email !== undefined) {
      if (typeof this.email !== "string") {
        errors.email = "Email must be a string";
      } else if (!this.isValidEmail(this.email)) {
        errors.email = "Email format is invalid";
      }
    }

    // Validate location
    if (this.location !== undefined) {
      if (typeof this.location !== "string") {
        errors.location = "Location must be a string";
      } else if (this.location.length > 255) {
        errors.location = "Location must not exceed 255 characters";
      }
    }

    // Validate avatar_url
    if (this.avatar_url !== undefined) {
      if (typeof this.avatar_url !== "string") {
        errors.avatar_url = "Avatar URL must be a string";
      } else if (!this.isValidUrl(this.avatar_url)) {
        errors.avatar_url = "Avatar URL format is invalid";
      }
    }

    // Validate github_url
    if (this.github_url !== undefined) {
      if (typeof this.github_url !== "string") {
        errors.github_url = "GitHub URL must be a string";
      } else if (!this.isValidUrl(this.github_url)) {
        errors.github_url = "GitHub URL format is invalid";
      }
    }

    // Validate provider
    if (this.provider !== undefined) {
      if (typeof this.provider !== "string") {
        errors.provider = "Provider must be a string";
      } else if (!["github", "gitlab", "google"].includes(this.provider.toLowerCase())) {
        errors.provider = "Provider must be one of: github, gitlab, google";
      }
    }

    // Validate github_access_token
    if (this.github_access_token !== undefined) {
      if (typeof this.github_access_token !== "string") {
        errors.github_access_token = "GitHub access token must be a string";
      } else if (this.github_access_token.trim().length === 0) {
        errors.github_access_token = "GitHub access token cannot be empty";
      }
    }

    // Validate latitude
    if (this.lat !== undefined) {
      if (typeof this.lat !== "number") {
        errors.lat = "Latitude must be a number";
      } else if (this.lat < -90 || this.lat > 90) {
        errors.lat = "Latitude must be between -90 and 90";
      }
    }

    // Validate longitude
    if (this.lng !== undefined) {
      if (typeof this.lng !== "number") {
        errors.lng = "Longitude must be a number";
      } else if (this.lng < -180 || this.lng > 180) {
        errors.lng = "Longitude must be between -180 and 180";
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  toObject(): Partial<UpdateUserDTO> {
    const obj: Partial<UpdateUserDTO> = {};

    if (this.name !== undefined) obj.name = this.name;
    if (this.email !== undefined) obj.email = this.email;
    if (this.location !== undefined) obj.location = this.location;
    if (this.avatar_url !== undefined) obj.avatar_url = this.avatar_url;
    if (this.github_url !== undefined) obj.github_url = this.github_url;
    if (this.provider !== undefined) obj.provider = this.provider;
    if (this.github_access_token !== undefined) obj.github_access_token = this.github_access_token;
    if (this.lat !== undefined) obj.lat = this.lat;
    if (this.lng !== undefined) obj.lng = this.lng;

    return obj;
  }
}

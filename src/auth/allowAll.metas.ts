import { SetMetadata } from "@nestjs/common";

export const IS_ALLOW_ANONYMOUS_KEY = 'is_allow_anonymous';
export const AllowAnonymous = () => SetMetadata(IS_ALLOW_ANONYMOUS_KEY, true);
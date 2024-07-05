export default interface User {
    chain?: string;
    createdAt?: string;
    email?: string;
    firstName?: string;
    firstVisit?: string;
    id?: string;
    lastName?: string;
    lastVisit?: string;
    metadata?: Record<string, unknown>; // Or a more specific type if you know the structure
    oauthAccounts?: Array<unknown>; // Specify the type if you know what it contains
    projectEnvironmentId?: string;
    sessions?: Array<unknown>; // Specify the type if you know what it contains
    updatedAt?: string;
    wallet?: string;
    walletPublicKey?: string;
    wallets?: Array<unknown>; // Specify the type if you know what it contains
    phoneNumber?: string,
    phoneCountryCode?: string,
  }
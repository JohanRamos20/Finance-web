import { request } from "@/api/client";
import type { BalanceResponse, Wallet } from "@/type/wallet";

export function getWallet(): Promise<Wallet> {
  return request<Wallet>("/users/me/wallet");
}

export function getBalance(): Promise<BalanceResponse> {
  return request<BalanceResponse>("/users/me/wallet/balance");
}

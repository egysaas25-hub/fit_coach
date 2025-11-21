"use client"

import { useQuery } from "@tanstack/react-query"

async function fetchApprovalCount(tenantId: string) {
  try {
    const params = new URLSearchParams({
      tenant_id: tenantId,
      status: "pending",
      limit: "1", // We only need the count
    })

    const response = await fetch(`/api/approvals?${params}`, {
      credentials: "include",
    })

    if (!response.ok) {
      return 0
    }

    const data = await response.json()
    return data.count || 0
  } catch (error) {
    console.error("Failed to fetch approval count:", error)
    return 0
  }
}

export function useApprovalCount(tenantId: string = "1") {
  return useQuery({
    queryKey: ["approval-count", tenantId],
    queryFn: () => fetchApprovalCount(tenantId),
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Consider data stale after 30 seconds
  })
}

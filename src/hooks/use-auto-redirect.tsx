import { useQueryState, parseAsBoolean } from "nuqs";

export const useAutoWorkspaceRedirect = () => {
  const [autoWorkspaceRedirect, setAutoWorkspaceRedirect] = useQueryState(
    "auto-workspace-redirect",
    parseAsBoolean.withDefault(true).withOptions({
      clearOnDefault: true,
    })
  )

  return {
    autoWorkspaceRedirect,
    setAutoWorkspaceRedirect
  }
};

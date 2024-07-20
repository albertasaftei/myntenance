"use client";

import { storeRepository } from "@/app/api/github/actions";
import { useGitHubRepositories } from "@/hooks/useGitHubRepositories";
import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { AutoComplete } from "./Autocomplete";
import { Button } from "./ui/button";

export const initialState = {
  message: "",
  error: false,
};

export function RepoSelector() {
  const [searchValue, setSearchValue] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const { data, isLoading } = useGitHubRepositories(searchValue);
  const items = data?.items || [];

  const storeWithRepo = storeRepository.bind(null, selectedValue);

  const [state, formAction] = useFormState(storeWithRepo, initialState);

  useEffect(() => {
    if (!state.message) return;

    if (state.error) {
      toast.error(state.message);
    } else {
      toast.success(state.message);
    }
  }, [state.error, state.message]);

  return (
    <div>
      <h2>Select a repository</h2>
      <form
        action={async (formData: FormData) => {
          setSearchValue("");
          setSelectedValue("");
          formAction();
        }}
      >
        <div className="flex gap-2">
          <div className="w-80">
            <AutoComplete
              selectedValue={selectedValue}
              onSelectedValueChange={setSelectedValue}
              searchValue={searchValue}
              onSearchValueChange={setSearchValue}
              items={items.map((item) => ({
                value: item.name,
                label: item.name,
              }))}
              placeholder="Search repositories..."
              isLoading={isLoading}
            />
          </div>

          <Button disabled={!selectedValue}>Select</Button>
        </div>
      </form>
    </div>
  );
}

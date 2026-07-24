"use client";

import React, { useState } from "react";
import { ChevronUp, Settings } from "lucide-react";

import GridAndDifficultySelector from "./GridAndDifficultySelector";
import GoToLeaderboard from "./GoToLeaderboard";
import AnalyticsBtn from "./AnalyticsBtn";
import UserAvatar from "./UserAvatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

export default function MobileSettingsSheet({
  gridSize,
  setGridSize,
  difficulty,
  setDifficulty,
  gameStarted,
  mode,
  setMode,
  user,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <Button
          variant="outline"
          onClick={() => setMobileOpen(true)}
          aria-label="Open settings"
          className="fixed bottom-5 right-4 z-50 h-auto rounded-full border-border bg-background px-4 py-2.5 shadow-lg flex items-center gap-2"
          style={{ paddingBottom: "max(10px, env(safe-area-inset-bottom))" }}
        >
          <Settings size={16} className="text-foreground/70 shrink-0" />
          <span className="text-xs font-semibold text-foreground">
            Settings
          </span>
          <div className="flex items-center gap-1 ml-1">
            <Badge className="text-[10px]">
              {gridSize}×{gridSize}
            </Badge>
            <Badge variant="secondary" className="text-[10px] capitalize">
              {difficulty}
            </Badge>
          </div>
          <ChevronUp size={14} className="text-muted-foreground ml-1" />
        </Button>

        <SheetContent
          side="bottom"
          className="rounded-t-2xl border-t border-border p-0 gap-0 max-h-[82dvh]"
        >
          <SheetTitle className="sr-only">Game Settings</SheetTitle>

          <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
            <div className="flex items-center gap-2">
              <Settings size={16} className="text-muted-foreground" />
              <span className="text-sm font-bold text-foreground">
                Game Settings
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="text-[10px]">
                {gridSize}×{gridSize}
              </Badge>
              <Badge variant="secondary" className="text-[10px] capitalize">
                {difficulty}
              </Badge>
              <Badge variant="secondary" className="text-[10px] capitalize">
                {mode}
              </Badge>
            </div>
          </div>

          <div className="overflow-y-auto overscroll-contain flex-1 px-4 pt-4 pb-6">
            <Card className="rounded-2xl border border-border divide-y divide-border overflow-hidden py-0">
              <div className="p-3">
                <UserAvatar user={user} />
              </div>
              <div className="p-4">
                <GridAndDifficultySelector
                  gridSize={gridSize}
                  setGridSize={setGridSize}
                  difficulty={difficulty}
                  setDifficulty={setDifficulty}
                  gameStarted={gameStarted}
                  mode={mode}
                  setMode={setMode}
                />
              </div>
            </Card>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <GoToLeaderboard />
              <AnalyticsBtn />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

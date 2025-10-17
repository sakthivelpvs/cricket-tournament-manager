import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Calendar, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTournamentSchema, type Tournament, type InsertTournament } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function Tournaments() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);
  const { toast } = useToast();

  const { data: tournaments, isLoading } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments"],
  });

  const form = useForm<InsertTournament>({
    resolver: zodResolver(insertTournamentSchema),
    defaultValues: {
      name: "",
      startDate: "",
      endDate: "",
      oversPerMatch: 10,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertTournament) => apiRequest("POST", "/api/tournaments", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      setDialogOpen(false);
      form.reset();
      toast({ title: "Tournament created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create tournament", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: InsertTournament }) =>
      apiRequest("PATCH", `/api/tournaments/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
      setDialogOpen(false);
      setEditingTournament(null);
      form.reset();
      toast({ title: "Tournament updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update tournament", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/tournaments/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({ title: "Tournament deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete tournament", variant: "destructive" });
    },
  });

  const handleOpenDialog = (tournament?: Tournament) => {
    if (tournament) {
      setEditingTournament(tournament);
      form.reset({
        name: tournament.name,
        startDate: tournament.startDate,
        endDate: tournament.endDate,
        oversPerMatch: tournament.oversPerMatch,
      });
    } else {
      setEditingTournament(null);
      form.reset({
        name: "",
        startDate: "",
        endDate: "",
        oversPerMatch: 10,
      });
    }
    setDialogOpen(true);
  };

  const onSubmit = (data: InsertTournament) => {
    if (editingTournament) {
      updateMutation.mutate({ id: editingTournament.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tournaments</h1>
          <p className="text-muted-foreground mt-2">
            Manage your cricket tournaments
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} data-testid="button-create-tournament">
          <Plus className="mr-2 h-4 w-4" />
          Create Tournament
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : tournaments && tournaments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament) => (
            <Card key={tournament.id} data-testid={`card-tournament-${tournament.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle>{tournament.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{tournament.startDate} - {tournament.endDate}</span>
                    </div>
                  </div>
                  <Badge variant="secondary">{tournament.oversPerMatch} Overs</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog(tournament)}
                    data-testid={`button-edit-tournament-${tournament.id}`}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this tournament?")) {
                        deleteMutation.mutate(tournament.id);
                      }
                    }}
                    data-testid={`button-delete-tournament-${tournament.id}`}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-3">
              <Trophy className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="font-semibold">No tournaments yet</h3>
              <p className="text-sm text-muted-foreground">
                Create your first tournament to get started
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent data-testid="dialog-tournament-form">
          <DialogHeader>
            <DialogTitle>
              {editingTournament ? "Edit Tournament" : "Create Tournament"}
            </DialogTitle>
            <DialogDescription>
              {editingTournament
                ? "Update tournament details"
                : "Create a new cricket tournament"}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tournament Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter tournament name"
                        data-testid="input-tournament-name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          data-testid="input-start-date"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          data-testid="input-end-date"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="oversPerMatch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Overs Per Match</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={5}
                        max={10}
                        data-testid="input-overs"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-submit-tournament"
                >
                  {editingTournament ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

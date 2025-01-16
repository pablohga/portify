"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

const planSchema = z.object({
  plans: z.array(z.object({
    name: z.string().min(1, "Name is required"),
    price: z.string().min(1, "Price is required"),
    description: z.string().min(1, "Description is required"),
    features: z.array(z.string().min(1, "Feature is required")),
    buttonText: z.string().min(1, "Button text is required"),
    popular: z.boolean().optional(),
  })),
});

interface PaymentPlansDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentPlansDialog({
  open,
  onOpenChange,
}: PaymentPlansDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof planSchema>>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      plans: [],
    },
  });

  useEffect(() => {
    async function fetchPlans() {
      try {
        const response = await fetch("/api/payment-plans");
        const data = await response.json();
        if (data.plans) {
          form.reset({ plans: data.plans });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch payment plans",
          variant: "destructive",
        });
      }
    }

    if (open) {
      fetchPlans();
    }
  }, [open, form, toast]);

  async function onSubmit(values: z.infer<typeof planSchema>) {
    try {
      setIsLoading(true);
      const response = await fetch("/api/payment-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error();

      toast({
        title: "Success",
        description: "Payment plans updated successfully",
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update payment plans",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const addPlan = () => {
    const currentPlans = form.getValues("plans");
    form.setValue("plans", [
      ...currentPlans,
      {
        name: "",
        price: "",
        description: "",
        features: [""],
        buttonText: "Start Now",
        popular: false,
      },
    ]);
  };

  const removePlan = (index: number) => {
    const currentPlans = form.getValues("plans");
    form.setValue(
      "plans",
      currentPlans.filter((_, i) => i !== index)
    );
  };

  const addFeature = (planIndex: number) => {
    const currentPlans = form.getValues("plans");
    const currentFeatures = currentPlans[planIndex].features;
    form.setValue(`plans.${planIndex}.features`, [...currentFeatures, ""]);
  };

  const removeFeature = (planIndex: number, featureIndex: number) => {
    const currentPlans = form.getValues("plans");
    const currentFeatures = currentPlans[planIndex].features;
    form.setValue(
      `plans.${planIndex}.features`,
      currentFeatures.filter((_, i) => i !== featureIndex)
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Payment Plans</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              {form.watch("plans")?.map((_, planIndex) => (
                <Card key={planIndex}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-lg">Plan {planIndex + 1}</CardTitle>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removePlan(planIndex)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name={`plans.${planIndex}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`plans.${planIndex}.price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`plans.${planIndex}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`plans.${planIndex}.buttonText`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Button Text</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`plans.${planIndex}.popular`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Popular Plan</FormLabel>
                            <FormDescription>
                              Mark this plan as popular to highlight it
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium">Features</h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addFeature(planIndex)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Feature
                        </Button>
                      </div>
                      {form.watch(`plans.${planIndex}.features`)?.map(
                        (_, featureIndex) => (
                          <div key={featureIndex} className="flex gap-2">
                            <FormField
                              control={form.control}
                              name={`plans.${planIndex}.features.${featureIndex}`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                removeFeature(planIndex, featureIndex)
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={addPlan}>
                <Plus className="h-4 w-4 mr-2" />
                Add Plan
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Plans"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
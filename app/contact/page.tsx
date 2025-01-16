import { ContactForm } from "@/components/contact-form";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container px-4 py-20 mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Entre em contato</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
          Tem alguma pergunta ou quer trabalhar conosco? Preencha o formulário abaixo e entrarei em contato com você o mais breve possível.
          </p>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
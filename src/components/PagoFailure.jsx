function PagoFailure() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-3xl font-bold text-red-600">Pago rechazado</h1>
      <p className="mt-4">Hubo un problema con tu pago. Intenta nuevamente o usa otro método.</p>
    </div>
  );
}
export default PagoFailure;
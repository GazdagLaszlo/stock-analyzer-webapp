namespace StockManager.DataContext.Entities
{
    public class StockData
    {
        public int Id { get; set; }
        public int StockId { get; set; }
        public Stock Stock { get; set; }
        public DateTime Date { get; set; } //Napi 1x frissítés

        //Mutatókat felvenni
        public double EPS { get; set; }
    }
}

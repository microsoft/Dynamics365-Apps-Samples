namespace Microsoft.Dynamics.Forecasting.Common.Models
{
    public class Field<T>
    {
        /// <summary>
        /// Gets or sets value.
        /// </summary>
        public T Value { get; set; }

        /// <summary>
        /// Gets or sets Display value.
        /// </summary>
        public string DisplayValue { get; set; }

        public Field(T value)
        {
            Value = value;
            DisplayValue = string.Empty;
        }

        public Field(T value, string displayValue)
        {
            Value = value;
            DisplayValue = displayValue;
        }

        public Field()
        {

        }

        public static implicit operator Field<T>(T value)
        {
            return new Field<T>() { Value = value };
        }
    }
}

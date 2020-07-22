using System;
using System.IO;
using System.Reflection;

namespace ForecastPublicApiUsageDemo
{
    public class LogWriter
    {
        private string LogFolderPath = string.Empty;
        private string CurrentLogFile = string.Empty;
        private static LogWriter logger;
        
        private static Boolean enableConsolePrint = true;

        private LogWriter()
        {
            string format = "Mddyyyyhhmmsstt";
            string _fileName = string.Format("{0}.log", DateTime.Now.ToString(format));
            LogFolderPath = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
            CurrentLogFile = string.Format("{0}\\{1}",LogFolderPath,_fileName);
            Console.WriteLine($"Log will be at: {CurrentLogFile}");
        }

        public void LogWrite(string logMessage)
        {
            try
            {   
                if (enableConsolePrint)
                {
                    Console.WriteLine(logMessage);
                }
                using (StreamWriter w = File.AppendText(CurrentLogFile))
                {
                    Log(logMessage, w);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Something went wrong, while wrting log");
            }
        }

        public static LogWriter GetLogWriter()
        {
            if (logger == null)
            {
                return logger = new LogWriter();
            }
            return logger;
        }

        private void Log(string logMessage, TextWriter txtWriter)
        {
            try
            {
                txtWriter.Write("\r\nLog Entry : ");
                txtWriter.WriteLine("{0} {1}", DateTime.Now.ToLongTimeString(),
                    DateTime.Now.ToLongDateString());
                txtWriter.WriteLine("  :");
                txtWriter.WriteLine("  :{0}", logMessage);
                txtWriter.WriteLine("-------------------------------");
            }
            catch (Exception ex)
            {
                Console.WriteLine("Something went wrong, while wrting log");
            }
        }
    }
}

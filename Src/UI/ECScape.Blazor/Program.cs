using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;

namespace ECScape.Blazor;

public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebAssemblyHostBuilder.CreateDefault(args);
        builder.RootComponents.Add<App>("#app");
        builder.RootComponents.Add<HeadOutlet>("head::after");

        builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });
        builder.Services.AddSingleton<GameEngineHost>();

        await builder.Build().RunAsync();
    }
}
